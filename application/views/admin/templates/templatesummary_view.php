<?php
Yii::app()->clientScript->registerScript('editorfiletype',"editorfiletype ='".$sEditorFileType."';",CClientScript::POS_HEAD); // Is this deprecated (2013-09-25) ?
?>


<?php if (is_template_editable($templatename)==true): ?>
    <div class="row template-sum">
        <div class="col-lg-12">

            <?php App()->getClientScript()->registerPackage('jquery-ace'); ?>
            <h4><?php echo sprintf(gT("Editing file '%s'"),$editfile); ?></h4>

            <?php if (!is_writable($templates[$templatename])):?>
                <div class="alert alert-warning alert-dismissible" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <?php eT("You can't save changes because the template directory is not writable."); ?>
                </div>
                <?php endif; ?>
        </div>
    </div>

    <div class="row template-sum">
        <div class="col-lg-2" id='templateleft'>
            <div style="padding-left:1em;">
                <?php eT("Standard files:"); ?><br>
                <?php
                $aSelectOptions=array(
                    gT("Screen part files")=>makeoptionswithindex($files,'pstpl'),
                    gT("JavaScript files")=>makeoptionswithindex($jsfiles,'js'),
                    gT("CSS files")=>makeoptionswithindex($cssfiles,'css'));
                $editindex='';
                foreach($aSelectOptions as $optgroup=>$options)
                {
                    if (array_search($editfile,$options)!==false)
                    {
                        $editindex=array_search($editfile,$options);
                        break;
                    }
                }
                echo CHtml::form(array('admin/templates/sa/view'), 'post', array('id'=>'general', 'class'=>'form-inline'));
                echo CHtml::listBox('editfile',$editindex,$aSelectOptions,
                    array('class'=>'form-control','size'=>'20','onchange'=>"javascript: this.form.submit();"));
                echo CHtml::hiddenField('screenname', $screenname, array('class'=>'screenname'));
                echo CHtml::hiddenField('templatename', $templatename, array('class'=>'templatename')); ?>

                </form>
            </div>
        </div>
        <div class="col-lg-8 templateeditor">
            <?php echo CHtml::form(array('admin/templates/sa/templatesavechanges'), 'post', array('id'=>'editTemplate', 'name'=>'editTemplate')); ?>

            <?php if(isset($_GET['editfile'])):?>
                <input type='hidden' name='editfileindex' value='<?php echo $_GET['editfile']; ?>' />
                <?php endif;?>
            <?php echo CHtml::hiddenField('templatename', $templatename, array('class'=>'templatename'));
            echo CHtml::hiddenField('screenname', $screenname, array('class'=>'screenname'));
            echo CHtml::hiddenField('editfile', $editindex);
            echo CHtml::hiddenField('editfilename', $editfile);
            echo CHtml::hiddenField('action', 'templatesavechanges');
            echo CHtml::textArea('changes', isset($editfile)?filetext($templatename,$editfile,$templates):'',array('rows'=>'20',
                                                                                                                   'cols'=>'40',
                                                                                                                   'data-filetype'=>$sEditorFileType,
                                                                                                                   'class'=>'ace '.$sTemplateEditorMode,
                                                                                                                    'style'=>'width:100%'
                                                                                                                    ));
                                                                                                                    ?>
            <p class='text-center'>
                <br/>
                <?php if (Permission::model()->hasGlobalPermission('templates','update')):?>
                    <?php if (is_writable($templates[$templatename])):?>
                        <input type='submit' class='btn btn-default' value='<?php eT("Save changes"); ?>'
                            <?php if (!is_template_editable($templatename)):?>
                                disabled='disabled' alt='<?php eT("Changes cannot be saved to a standard template."); ?>'
                                <?php endif; ?>
                            />
                        <?php endif; ?>
                    <?php endif; ?>
            </p>
            </form>
        </div>



        <div class="col-lg-2" style="overflow-x: hidden">
            <div>
                <?php eT("Other files:"); ?>
                <br/>
                <?php // TODO printf(gT("(path for css: %s)"), $filespath) ?>
                <?php echo CHtml::form(array('admin/templates/sa/templatefiledelete'), 'post'); ?>
                <select size='11' class="form-control" name='otherfile' id='otherfile'>
                    <?php echo makeoptions($otherfiles, "name", "name", ""); ?>
                </select><br>
                <?php
                if (Permission::model()->hasGlobalPermission('templates','delete'))
                { ?>

                    <input type='submit' class='btn btn-default' value='<?php eT("Delete"); ?>' onclick="javascript:return confirm('<?php eT("Are you sure you want to delete this file?","js"); ?>')"/>
                    <?php
                }
                echo CHtml::hiddenField('templatename', $templatename, array('class'=>'templatename'));
                echo CHtml::hiddenField('screenname', $screenname, array('class'=>'screenname')); ?>
                <input type='hidden' name='editfile' value='<?php echo $editfile; ?>' />
                <input type='hidden' name='action' value='templatefiledelete' />
                <?php if(isset($_GET['editfile'])):?>
                    <input type='hidden' name='editfileindex' value='<?php echo $_GET['editfile']; ?>' />
                    <?php endif;?>

                </form>
            </div>
            <div style='margin-top:1em;'>
                <?php
                if (Permission::model()->hasGlobalPermission('templates','update'))
                { ?>

                    <?php echo CHtml::form(array('admin/templates/sa/uploadfile'), 'post', array('id'=>'importtemplatefile', 'name'=>'importtemplatefile', 'enctype'=>'multipart/form-data')); ?>
                    <?php eT("Upload a file:"); ?>
                    <br>
                    <input name='upload_file' id="upload_file" type="file" required="required"/>
                    <input type='submit' value='<?php eT("Upload"); ?>' class='btn btn-default'
                        <?php if (!is_template_editable($templatename)) : ?>
                            disabled='disabled'
                            <?php endif; ?>
                        />
                    <input type='hidden' name='editfile' value='<?php echo $editfile; ?>' />
                    <?php echo CHtml::hiddenField('templatename', $templatename, array('class'=>'templatename'));
                    echo CHtml::hiddenField('screenname', $screenname, array('class'=>'screenname')); ?>
                    <input type='hidden' name='action' value='templateuploadfile' />
                    <?php if(isset($_GET['editfile'])):?>
                        <input type='hidden' name='editfileindex' value='<?php echo $_GET['editfile']; ?>' />
                        <?php endif;?>
                    </form>
                    <?php
                }
                ?>
            </div>

            <div class="">
                <a href="#" data-toggle="modal" data-target="#fileHelp" />
                <?php eT('Tip: How to embed a picture in your template?'); ?>
                </a>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="fileHelp" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel"><?php eT('Tip: How to display a picture in your template?'); ?></h4>
                    </div>
                    <div class="modal-body">
                        <?php eT('To use a picture in a .pstpl file:');?><br/>
                        <code>&lt;img src="{TEMPLATEURL}/files/yourpicture.png" /&gt;</code><br/><br/>
                        <?php eT("To use a picture in a .css file: ");?><br/>
                        <code>background-image: url('../files/yourpicture.png');</code><br/><br/>
                        <?php eT("To place the logo anywhere in a .pstpl file: ");?><br/>
                        <code>{SITELOGO}</code><br/>
                        <?php eT("it will generate a responsive image containing the logo file.");?><br/>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><?php eT("Close");?></button>
                    </div>
                </div>
            </div>
        </div>



    </div>
    </div>
    <?php else:?>
            <?php echo CHtml::form(array('admin/templates/sa/view'), 'post', array('id'=>'general', 'style'=>'display:none;', 'class'=>'form-inline')); ?>
                <?php
                echo CHtml::hiddenField('screenname', $screenname, array('class'=>'screenname'));
                echo CHtml::hiddenField('templatename', $templatename, array('class'=>'templatename')); ?>

            </form>
    <?php endif;?>


<div class="row template-sum" style="margin-bottom: 100px;">
    <div class="col-lg-12">
        <h4>
            <?php eT("Preview:"); ?>
        </h4>
        <div class="jumbotron message-box">
            <input type='button' value='<?php eT("Mobile"); ?>' id='iphone' class="btn btn-default"/>
            <input type='button' value='640x480' id='x640' class="btn btn-default" />
            <input type='button' value='800x600' id='x800' class="btn btn-default" />
            <input type='button' value='1024x768' id='x1024' class="btn btn-default" />
            <input type='button' value='<?php eT("Full"); ?>' id='full' class="btn btn-default" />
            <br><br><br><br>

            <div style='width:90%; margin:0 auto;'>
                <?php if(isset($filenotwritten) && $filenotwritten==true)
                { ?>
                    <p>
                        <span class ='errortitle'><?php echo sprintf(gT("Please change the directory permissions of the folder %s in order to preview templates."), $tempdir); ?></span>
                    </p>
                </div>
                <?php }
            else
            { ?>
                <p>
                    <iframe id='previewiframe' src='<?php echo $this->createUrl('admin/templates/sa/tmp/',array('id'=>$time)); ?>' height='768' name='previewiframe' style='width:95%;background-color: white;'>Embedded Frame</iframe>
                </p>
            </div>
            <?php
        } ?>
    </div>
</div>
</div>
